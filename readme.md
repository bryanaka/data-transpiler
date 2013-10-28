Data Transpiler
===========================

Converts to and from the following data formats

- HTML Table
- Object or Array of Objects (collection) only one level currently
- CSV

Uses
-------------------------

    $(<select table element here>).tableToJSON();
    #=> Object {data: [{...}, {...}]}
    
    $(<select table element here>).tableToCSV();
    #=> String '"blah","topblah","lowblah"'...

	// use a collection or obj
    $.JSONToCSV([...]);
    #=> String '"blah","topblah","lowblah"'...

    $.JSONToTable([...]);
    #=> String '<table>....</table>';
	
	// use a csv string
	$.CSVToJSON(csvString);
	#=> Object { data: [{...}, {...}] }

    $.CSVToTable(csvString);
    #=> String '<table>....</table>';



Tests
---------------------

Uses Jasmine to test, Karma is the testrunner. just use karma start to run tests on phantomjs. 

The goal is to run on IE8+, Chrome, Firefox, Opera (all 2-3 versions previous)

This is not fully tested yet and will/will likely fail in the following scenarios right now:

- tables utilizing colspan
- JSON with many nested levels (you cannot represent this in CSV or Tables easily)

Goal
---------------------------

My goal is to provide a very efficent and powerful utility functions that help traspile data from one format to another.

### Future support planned for

- YAML
- TSV
- Excel/xlsx

Future Milestones
------------------------

- Remove jQuery dependancy
- Add more options to customize the transpiling
- Better API
- Run in both a node and browser environment
- Test beyond the basic cases (add more tests)
- Provide more efficent algorithms to produce faster operations
- (maybe) implement promise-based async computation (see lazy.js)
