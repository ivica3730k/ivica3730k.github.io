var DEBUG = false;

function fillWebContent(category, fillScriptId, filledElementId) {
	var _json = _getJsonFromXML("./static/items.xml");
	if (category) {
		_fillData(_json[category], fillScriptId, filledElementId);
	} else {
		for (var i in _json) {
			_fillData(_json[i], fillScriptId, filledElementId);
		}
	}
}

function _filterJsonById(productId) {
	var json = _getJsonFromXML("./static/items.xml");
	for (var i in json) {
		for (var x in json[i]["ITEM"]) {
			if (productId === (json[i]["ITEM"][x]["ID"])) {
				return (json[i]["ITEM"][x]);
			}
		}
	}
}

function getCatById(productId){
	var json = _getJsonFromXML("./static/items.xml");
	for (var i in json) {
		for (var x in json[i]["ITEM"]) {
			if (productId === (json[i]["ITEM"][x]["ID"])) {
				return (i);
			}
		}
	}
}

function fillWebContentById(productId, fillScriptId, filledElementId) {
	var data = _filterJsonById(productId);
	_fillData(data, fillScriptId, filledElementId);
}

function returnImagesById(productId) {
	var data = _filterJsonById(productId);
	data = data["IMAGES"]["IMG"];
	return data;
}

function returnImages() {
	var json = _getJsonFromXML("./static/items.xml");
	images = [];
	for (var i in json) {
		if (!Array.isArray(json[i]["ITEM"])) {
		}
		for (var m in json[i]["ITEM"]) {
			images.push(json[i]["ITEM"][m]["IMAGES"]["IMG"][0]);
		}
	}
	return images;
}


function _fillData(jsondata, fillScriptId, filledElementId) {
	var templateScript = $(fillScriptId).html()
	var template = Handlebars.compile(templateScript)
	$(filledElementId).append(template(jsondata));
}

function _getJsonFromXML(xmlpath) {
	var Connect = new XMLHttpRequest();
	Connect.open("GET", xmlpath, false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);
	var xmlcontent = Connect.responseXML;
	if (DEBUG)
		console.log(xmlcontent);
	var json = xmlToJson.parse(xmlcontent);
	//than finaly return json which can go into handlebars
	json = json["CONTENT"];
	for (var i in json) {
		if (!Array.isArray(json[i]["ITEM"])) {
			json[i]["ITEM"] = [json[i]["ITEM"]];
		}
		for (var m in json[i]["ITEM"]) {
			if (!Array.isArray(json[i]["ITEM"][m]["IMAGES"]["IMG"])) {
				json[i]["ITEM"][m]["IMAGES"]["IMG"] = [json[i]["ITEM"][m]["IMAGES"]["IMG"]];
			}
		}
	}
	return json;
}



/**
 * Object assign is required, so ensure that browsers know how to execute this method
 *
 * @method Object.assign
 * @returns {Function}
 */
if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}


/**
 * Object to convert XML into a structured JSON object
 *
 * @method xmlToJson
 * @returns {Object}
 */
var xmlToJson = (function () {
	var self = this;


	/**
	 * Adds an object value to a parent object
	 *
	 * @method addToParent
	 * @param {Object} parent
	 * @param {String} nodeName
	 * @param {Mixed} obj
	 * @returns none
	 */
	self.addToParent = function (parent, nodeName, obj) {
		// If this is the first or only instance of the node name, assign it as
		// an object on the parent.
		if (!parent[nodeName]) {
			parent[nodeName] = obj;
		}
		// Else the parent knows about other nodes of the same name
		else {
			// If the parent has a property with the node name, but it is not an array,
			// store the contents of that property, convert the property to an array, and
			// assign what was formerly an object on the parent to the first member of the
			// array
			if (!Array.isArray(parent[nodeName])) {
				var tmp = parent[nodeName];
				parent[nodeName] = [];
				parent[nodeName].push(tmp);
			}

			// Push the current object to the collection
			parent[nodeName].push(obj);
		}
	};


	self.convertXMLStringToDoc = function (str) {
		var xmlDoc = null;

		if (str && typeof str === 'string') {
			// Create a DOMParser
			var parser = new DOMParser();

			// Use it to turn your xmlString into an XMLDocument
			xmlDoc = parser.parseFromString(str, 'application/xml');
		}

		return xmlDoc;
	}


	/**
	 * Validates if an data is an XMLDocument
	 *
	 * @method isXML
	 * @param {Mixed} data
	 * @returns {Boolean}
	 */
	self.isXML = function (data) {
		var documentElement = (data ? data.ownerDocument || data : 0).documentElement;

		return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false;
	};


	/**
	 * Reads through a node's attributes and assigns the values to a new object
	 *
	 * @method parseAttributes
	 * @param {XMLNode} node
	 * @returns {Object}
	 */
	self.parseAttributes = function (node) {
		var attributes = node.attributes,
			obj = {};

		// If the node has attributes, assign the new object properties
		// corresponding to each attribute
		if (node.hasAttributes()) {
			for (var i = 0; i < attributes.length; i++) {
				obj[attributes[i].name] = self.parseValue(attributes[i].value);
			}
		}

		// return the new object
		return obj;
	};


	/**
	 * Rips through child nodes and parses them
	 *
	 * @method parseChildren
	 * @param {Object} parent
	 * @param {XMLNodeMap} childNodes
	 * @returns none
	 */
	self.parseChildren = function (parent, childNodes) {
		// If there are child nodes...
		if (childNodes.length > 0) {
			// Loop over all the child nodes
			for (var i = 0; i < childNodes.length; i++) {
				// If the child node is a XMLNode, parse the node
				if (childNodes[i].nodeType == 1) {
					self.parseNode(parent, childNodes[i]);
				}
			}
		}
	};


	/**
	 * Converts a node into an object with properties
	 *
	 * @method parseNode
	 * @param {Object} parent
	 * @param {XMLNode} node
	 * @returns {Object}
	 */
	self.parseNode = function (parent, node) {
		var nodeName = node.nodeName,
			obj = Object.assign({}, self.parseAttributes(node)),
			tmp = null;

		// If there is only one text child node, there is no need to process the children
		if (node.childNodes.length == 1 && node.childNodes[0].nodeType == 3) {
			// If the node has attributes, then the object will already have properties.
			// Add a new property 'text' with the value of the text content
			if (node.hasAttributes()) {
				obj['text'] = self.parseValue(node.childNodes[0].nodeValue);
			}
			// If there are no attributes, then the parent[nodeName] property value is
			// simply the interpreted textual content
			else {
				obj = self.parseValue(node.childNodes[0].nodeValue);
			}
		}
		// Otherwise, there are child XMLNode elements, so process them
		else {
			self.parseChildren(obj, node.childNodes);
		}

		// Once the object has been processed, add it to the parent
		self.addToParent(parent, nodeName, obj)

		// Return the parent
		return parent;
	};


	/**
	 * Interprets a value and converts it to Boolean, Number or String based on content
	 *
	 * @method parseValue
	 * @param {Mixed} val
	 * @returns {Mixed}
	 */
	this.parseValue = function (val) {
		// Create a numeric value from the passed parameter
		var num = Number(val);

		// If the value is 'true' or 'false', parse it as a Boolean and return it
		if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
			return (val.toLowerCase() == 'true');
		}

		// If the num parsed to a Number, return the numeric value
		// Else if the valuse passed has no length (an attribute without value) return null,
		// Else return the param as is
		return (isNaN(num)) ? val.trim() : (val.length == 0) ? null : num;
	};

	// Expose the API
	return {
		parse: function (xml) {
			if (xml && typeof xml === 'string') {
				xml = self.convertXMLStringToDoc(xml);
			}
			return (xml && self.isXML(xml)) ? self.parseNode({}, xml.firstChild) : null;
		}
	}
})();