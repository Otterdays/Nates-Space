// [TRACE: DOCS/ARCHITECTURE.md] Merges scan (folder) + overrides + EP list. Load after data.js + music-catalog.generated.js.
(function () {
    if (!window.NatesData) return;

    NatesData.getMusicCatalogMerged = function getMusicCatalogMerged() {
        var scanned = typeof window.__MUSIC_CATALOG_SCAN !== 'undefined'
            ? window.__MUSIC_CATALOG_SCAN
            : null;
        var fallback = Array.isArray(this.musicCatalog) && this.musicCatalog.length
            ? this.musicCatalog
            : [];
        var base = scanned && scanned.length ? scanned.slice() : fallback.slice();
        var overrides = this.musicTrackOverrides || {};
        var epSet = new Set(this.epTrackSrcs || []);

        return base.map(function (t) {
            var o = overrides[t.src] || {};
            var merged = {};
            Object.keys(t).forEach(function (k) {
                merged[k] = t[k];
            });
            Object.keys(o).forEach(function (k) {
                merged[k] = o[k];
            });
            merged.includeOnEp = epSet.has(merged.src) === true
                || o.includeOnEp === true
                || t.includeOnEp === true;
            return merged;
        });
    };

    NatesData.getEpTracks = function getEpTracks() {
        var merged = this.getMusicCatalogMerged().filter(function (t) {
            return t.includeOnEp === true;
        });
        var order = this.epTrackSrcs || [];
        if (!order.length) return merged;
        var rank = {};
        order.forEach(function (src, i) {
            rank[src] = i;
        });
        merged.sort(function (a, b) {
            var ia = rank[a.src];
            var ib = rank[b.src];
            if (ia === undefined) ia = 9999;
            if (ib === undefined) ib = 9999;
            return ia - ib;
        });
        return merged;
    };
})();
