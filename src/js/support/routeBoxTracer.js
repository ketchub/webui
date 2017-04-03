import { each } from 'lodash';

/*eslint-disable */
/**
 * @see http://stackoverflow.com/questions/13746284/merging-multiple-adjacent-rectangles-into-one-polygon
 */
/*eslint-enable */
export default function (boxes) {

  const dedupedPoints = [];

  each(
    // easy way to remove duplicates since doing object equality comparison is
    // expensive
    boxes.reduce((accumulator, _box) => {
      const ne = _box.getNorthEast().toJSON();
      const sw = _box.getSouthWest().toJSON();
      const se = {lat:sw.lat, lng:ne.lng};
      const nw = {lat:ne.lat, lng:sw.lng};
      accumulator[`${ne.lat}_${ne.lng}`] = ne;
      accumulator[`${se.lat}_${se.lng}`] = se;
      accumulator[`${sw.lat}_${sw.lng}`] = sw;
      accumulator[`${nw.lat}_${nw.lng}`] = nw;
      return accumulator;
    }, {}),
    // receive each value in the deduped obj and push to array
    (latLng) => { dedupedPoints.push(latLng); }
  );

  // clone dedupedPoints as new array
  const sortedLat = dedupedPoints.concat();
  const sortedLng = dedupedPoints.concat();
  const edgesH = {};
  const edgesV = {};

  // sort preferring latitude priority
  sortedLat.sort((a, b) => {
    const aLat = Math.abs(a.lat);
    const aLng = Math.abs(a.lng);
    const bLat = Math.abs(b.lat);
    const bLng = Math.abs(b.lng);
    if (a.lat === b.lat) {
      return aLng < bLng ? -1 : 1;
    }
    return aLat < bLat ? -1 : 1;
  });

  // sort preferring longitude priority
  sortedLng.sort((a, b) => {
    if (a.lng === b.lng) {
      return Math.abs(a.lat) < Math.abs(b.lat) ? -1 : 1;
    }
    return Math.abs(a.lng) < Math.abs(b.lng) ? -1 : 1;
  });

  each(sortedLat, lll => {
    console.log(`${lll.lat} _ ${lll.lng} \n`);
  });
  console.log('\n-----\n');
  each(sortedLng, lll => {
    console.log(`${lll.lat} _ ${lll.lng} \n`);
  });

  var x = 0;
  var latLen = sortedLat.length - 1;
  while (x < latLen) {
    var currX = sortedLat[x].lat;
    while (x < latLen && sortedLat[x].lat === currX) {
      var aLat = sortedLat[x].lat;
      var aLng = sortedLat[x].lng;
      var bLat = sortedLat[x + 1].lat;
      var bLng = sortedLat[x + 1].lng;
      edgesV[aLat + ':' + aLng] = bLat + ':' + bLng;
      edgesV[bLat + ':' + bLng] = aLat + ':' + aLng;
      x += 2;
    }
  }

  var i = 0;
  var lngLen = sortedLng.length - 1;
  while (i < lngLen) {
    var currY = sortedLng[i].lng;
    while (i < lngLen && sortedLng[i].lng === currY) {
      var aaLat = sortedLng[i].lat;
      var aaLng = sortedLng[i].lng;
      var bbLat = sortedLng[i + 1].lat;
      var bbLng = sortedLng[i + 1].lng;
      edgesH[aaLat + ':' + aaLng] = bbLat + ':' + bbLng;
      edgesH[bbLat + ':' + bbLng] = aaLat + ':' + aaLng;
      i += 2;
    }
  }

  // Get all polygons
  var p = [];
  while (Object.keys(edgesH).length) {
    var startKey = Object.keys(edgesH)[0];
    var polygon = [[startKey, 0]];
    delete(edgesH[startKey]);

    while (true) {
      var curr = polygon[polygon.length - 1][0];
      var e = polygon[polygon.length - 1][1];
      var nextVertex;
      if (e === 0) {
        nextVertex = edgesV[curr];
        if (!nextVertex) { break; }
        delete edgesV[curr];
        polygon.push([nextVertex, 1]);
      } else {
        nextVertex = edgesH[curr];
        if (!nextVertex) { break; }
        delete edgesH[curr];
        polygon.push([nextVertex, 0]);
      }
      if (polygon[polygon.length - 1][0] === polygon[0][0]) {
        polygon.pop();
        break;
      }
    }

    for (var pI = 0; pI < polygon.length; pI++) {
      var pt = polygon[pI][0];
      var ptCoords = pt.split(':');
      var lat = ptCoords[0];
      var lng = ptCoords[1];
      p.push({lat:+lat, lng:+lng});
      delete edgesH[pt];
      delete edgesV[pt];
    }
  }

  console.log('\n\n', p, '\n\n');

  return p;
}