/*!
 * dc-addons v0.13.5
 *
 * 2018-06-22 09:54:20
 *
 */
if (!dc.utils.getAllFilters) {
    dc.utils.getAllFilters = function () {
        var result = {};
        var list = dc.chartRegistry.list();

        for (var e in list) {
            var chart = list[e];
            result[chart.chartID()] = chart.filters();
        }

        return result;
    };
}
