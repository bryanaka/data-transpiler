(function($, window, document, undefined) {

	var defaults = {
		ignore: []
	};

	function getKeys($el) {
		var keys = $el.find('th').map(function(index, val) {
			return val.innerText;
		});
		return $.makeArray(keys);
	}

	function getUnderscoredKeys($el) {
		var keys = $el.find('th').map(function(index, val) {
			return val.innerText.replace(/\s/gi, "_");
		});
		return $.makeArray(keys);
	}

	function getData($el) {
		return $el.find('td').map(function(index, val) {
			return val.innerText;
		});
	}

	function tableToJSON() {
		var keys      = getUnderscoredKeys(this),
			keyCount  = keys.length,
			data      = getData(this),
			dataCount = data.length,
			collection = [],
			i = 0;

		while(i < dataCount) {
			var obj = {};
			for(var n = 0; n < keyCount; n++) {
				if(!isNaN(data[i])) { data[i] = +data[i]; }
				obj[keys[n]] = data[i];
				i++;
			}
			collection.push(obj);
		}
		return { "data": collection };
	}

	function tableToCSV() {
		var keys      = getKeys(this),
			keyCount  = keys.length,
			data      = getData(this),
			dataCount = data.length,
			csv       = '';

		csv = csv + '"'+keys.join('\",\"') + '"\n';
		return csv;
	}

	function JSONToTable() {}
	function JSONToCSV() {}

	function CSVToTable() {}
	function CSVToJSON() {}

	$.fn.tableToJSON = tableToJSON;
	$.fn.tableToCSV = tableToCSV;


})(jQuery, window, document);