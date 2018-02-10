"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _searchInput = require("./search-input");

var _searchInput2 = _interopRequireDefault(_searchInput);

var _nestedObjects = require("nested-objects");

var _nestedObjects2 = _interopRequireDefault(_nestedObjects);

var _lodash = require("lodash.get");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 *  @class InfinityMenu
 */
var InfinityMenu = function (_React$Component) {
	_inherits(InfinityMenu, _React$Component);

	/*
  *  @constructs InfinityMenu
  */
	function InfinityMenu(props) {
		_classCallCheck(this, InfinityMenu);

		var _this = _possibleConstructorReturn(this, (InfinityMenu.__proto__ || Object.getPrototypeOf(InfinityMenu)).call(this, props));

		_this.state = {
			search: {
				isSearching: false,
				searchInput: ""
			}
		};
		_this.setSearchInput = _this.setSearchInput.bind(_this);
		_this.stopSearching = _this.stopSearching.bind(_this);
		_this.startSearching = _this.startSearching.bind(_this);
		return _this;
	}
	/*
  *	@function onNodeClick
  *	@description open or close folder
  *
  *	@param {string} folder - key name of folder object
  */


	_createClass(InfinityMenu, [{
		key: "onNodeClick",
		value: function onNodeClick(tree, node, keyPath, event) {
			event.preventDefault();
			if (!this.state.search.isSearching || !this.state.search.searchInput.length) {
				node.isOpen = !node.isOpen;
				node.maxLeaves = this.props.maxLeaves;
				_nestedObjects2.default.set(tree, keyPath, node);
				if (this.props.onNodeMouseClick) {
					var currLevel = Math.floor(keyPath.split(".").length / 2);
					this.props.onNodeMouseClick(event, tree, node, currLevel, keyPath);
				}
			}
		}
	}, {
		key: "onLoadMoreClick",
		value: function onLoadMoreClick(tree, node, keyPath, event) {
			event.preventDefault();
			// get parent node so we can increment it's unique max leaves property
			var keyPathArray = keyPath.split(".");
			var parentPath = Object.assign([], keyPathArray).splice(0, keyPathArray.length - 2);
			var parentNode = (0, _lodash2.default)(this.props.tree, parentPath);
			// set new max leaves - if none exist use component default property
			parentNode.maxLeaves = !parentNode.maxLeaves ? this.props.maxLeaves : parentNode.maxLeaves + this.props.maxLeaves;
			if (this.props.onNodeMouseClick) {
				var currLevel = Math.floor(keyPath.split(".").length / 2);
				this.props.onNodeMouseClick(event, tree, node, currLevel, keyPath);
			}
		}
		/*
  * @function shouldComponentUpdate
  * @returns {boolean} return based on user pass in shouldComponentUpdate or return true
  */

	}, {
		key: "shouldComponentUpdate",
		value: function shouldComponentUpdate(nextProps, nextState) {
			if (nextProps.shouldComponentUpdate) {
				return nextProps.shouldComponentUpdate(this.props, this.state, nextProps, nextState);
			}

			return true;
		}
		/*
   *	@function startSearching
   *	@description when not searching and search icon clicked, set state to start
   */

	}, {
		key: "startSearching",
		value: function startSearching() {
			this.setState({
				search: {
					isSearching: true,
					searchInput: ""
				}
			});
		}
		/*
   *	@function stopSearching
   *	@description when searching and close icon clicked, set state to stop
   */

	}, {
		key: "stopSearching",
		value: function stopSearching() {
			this.setState({
				search: {
					isSearching: false,
					searchInput: ""
				}
			});
		}
		/*
   *	@function setSearchInput
   *	@description when user types in search input, set phrase in state for filter
   */

	}, {
		key: "setSearchInput",
		value: function setSearchInput(event) {
			this.setState({
				search: {
					isSearching: true,
					searchInput: event.target.value
				}
			});
		}
	}, {
		key: "findFiltered",
		value: function findFiltered(trees, node, key) {
			var _this2 = this;

			if (!node.children) {
				var nodeMatchesSearchFilter = this.props.filter(node, this.state.search.searchInput);
				if (nodeMatchesSearchFilter) {
					node.isSearchDisplay = true;
					trees[key] = node;
					return trees;
				}

				node.isSearchDisplay = false;
				trees[key] = node;
				return trees;
			}

			var filteredSubFolder = node.children.length ? node.children.reduce(function (p, c, k) {
				return _this2.findFiltered(p, c, k);
			}, []) : [];
			var shouldDisplay = filteredSubFolder.some(function (child) {
				return child.isSearchDisplay;
			});

			if (shouldDisplay) {
				node.isSearchOpen = true;
				node.children = filteredSubFolder;
				node.isSearchDisplay = true;
				node.maxLeaves = node.maxLeaves ? node.maxLeaves : this.props.maxLeaves;
				trees[key] = node;
				return trees;
			}

			node.isSearchOpen = false;
			node.isSearchDisplay = false;
			trees[key] = node;
			return trees;
		}

		/*
   *	@function setDisplayTree
   *	@description recursive go through the tree and set the render tree
   *
   *	@param {array} tree - whole tree
   *	@param {array} prevs - the whole rendering array
   *	@param {object} curr - current node/leaf
   *	@param {string} keyPath - the path to current node/leaf, e.g.  "0.children.1"
   */

	}, {
		key: "setDisplayTree",
		value: function setDisplayTree(tree, prevs, curr, keyPath) {
			var _this3 = this;

			var currLevel = Math.floor(keyPath.length / 2);
			var currCustomComponent = typeof curr.customComponent === "string" ? this.props.customComponentMappings[curr.customComponent] : curr.customComponent;
			var currCustomloadMoreComponent = this.props.loadMoreComponent ? this.props.loadMoreComponent : null;
			var isSearching = this.state.search.isSearching && this.state.search.searchInput;
			var shouldDisplay = isSearching && curr.isSearchDisplay || !isSearching;
			curr.keyPath = keyPath;

			/* the leaves */
			if (!curr.children) {
				var keyPathArray = keyPath.split(".");
				var parentPath = Object.assign([], keyPathArray).splice(0, keyPathArray.length - 2);
				var parentNode = (0, _lodash2.default)(this.props.tree, parentPath);
				var filteredChildren = parentNode.children.some(function (child) {
					return child.isSearchDisplay === true;
				}) ? parentNode.children.filter(function (child) {
					return child.isSearchDisplay === true;
				}) : parentNode.children;
				var itemKey = "infinity-menu-leaf-" + curr.id;
				var visIds = filteredChildren.map(function (e) {
					return e.id;
				});

				var relativeIndex = visIds.indexOf(curr.id);
				relativeIndex = relativeIndex === -1 ? Infinity : relativeIndex;

				var parentMaxLeaves = parentNode.maxLeaves || this.props.maxLeaves;
				if (shouldDisplay && parentMaxLeaves > relativeIndex) {
					if (curr.customComponent) {
						var componentProps = {
							key: itemKey,
							onMouseDown: function onMouseDown(e) {
								_this3.props.onLeafMouseDown ? _this3.props.onLeafMouseDown(e, curr) : null;
							},
							onMouseUp: function onMouseUp(e) {
								_this3.props.onLeafMouseUp ? _this3.props.onLeafMouseUp(e, curr) : null;
							},
							onClick: function onClick(e) {
								_this3.props.onLeafMouseClick ? _this3.props.onLeafMouseClick(e, curr) : null;
							},
							name: curr.name,
							icon: curr.icon,
							data: curr
						};
						prevs.push(_react2.default.createElement(currCustomComponent, componentProps));
					} else {
						prevs.push(_react2.default.createElement(
							"li",
							{ key: itemKey,
								className: "infinity-menu-leaf-container",
								onMouseDown: function onMouseDown(e) {
									return _this3.props.onLeafMouseDown ? _this3.props.onLeafMouseDown(e, curr) : null;
								},
								onMouseUp: function onMouseUp(e) {
									return _this3.props.onLeafMouseUp ? _this3.props.onLeafMouseUp(e, curr) : null;
								},
								onClick: function onClick(e) {
									return _this3.props.onLeafMouseClick ? _this3.props.onLeafMouseClick(e, curr) : null;
								}
							},
							_react2.default.createElement(
								"span",
								null,
								curr.name
							)
						));
					}
				} else if (relativeIndex === filteredChildren.length - 1) {
					if (currCustomloadMoreComponent) {
						var loadMoreProps = {
							key: itemKey,
							onClick: this.onLoadMoreClick.bind(this, tree, curr, keyPath)
						};
						prevs.push(_react2.default.createElement(currCustomloadMoreComponent, loadMoreProps));
					} else {
						prevs.push(_react2.default.createElement(
							"li",
							{ key: itemKey,
								className: "infinity-menu-load-more-container",
								onClick: this.onLoadMoreClick.bind(this, tree, curr, keyPath)
							},
							_react2.default.createElement(
								"span",
								null,
								"Load more"
							)
						));
					}
				}
				return prevs;
			}
			/* the node */

			var key = "infinity-menu-node-" + currLevel + "-" + curr.id;
			var nodeName = curr.name;
			if (!curr.isOpen && !isSearching || !curr.isSearchOpen && isSearching) {
				if (shouldDisplay) {
					if (curr.customComponent) {
						var nodeProps = {
							onClick: this.onNodeClick.bind(this, tree, curr, keyPath),
							name: nodeName,
							isOpen: curr.isOpen,
							isSearching: false,
							data: curr,
							key: key
						};
						prevs.push(_react2.default.createElement(currCustomComponent, nodeProps));
					} else {
						prevs.push(_react2.default.createElement(
							"div",
							{ key: key,
								onClick: this.onNodeClick.bind(this, tree, curr, keyPath),
								className: "infinity-menu-node-container"
							},
							_react2.default.createElement(
								"label",
								null,
								nodeName
							)
						));
					}
				}
				return prevs;
			}

			var openedNode = [];
			if (shouldDisplay) {
				if (curr.customComponent) {
					var _nodeProps = {
						onClick: this.onNodeClick.bind(this, tree, curr, keyPath),
						name: nodeName,
						isOpen: curr.isOpen,
						data: curr,
						key: key,
						isSearching: isSearching
					};
					openedNode.push(_react2.default.createElement(currCustomComponent, _nodeProps));
				} else {
					openedNode.push(_react2.default.createElement(
						"div",
						{ key: key,
							onClick: this.onNodeClick.bind(this, tree, curr, keyPath),
							className: "infinity-menu-node-container"
						},
						_react2.default.createElement(
							"label",
							null,
							nodeName
						)
					));
				}

				var childrenList = curr.children.length ? curr.children.reduce(function (p, c, k) {
					if (c === undefined || k === undefined) {
						return p;
					}
					return _this3.setDisplayTree(tree, p, c, keyPath + ".children." + k);
				}, []) : [];

				if (childrenList.length > 0) {
					openedNode.push(_react2.default.createElement(
						"ul",
						{ key: "infinity-menu-children-list" + currLevel },
						childrenList
					));
				}
				prevs.push(openedNode);
			}
			return prevs;
		}
		/*
   *  @function _renderBody
   *  @description Renders the body content
   */

	}, {
		key: "renderBody",
		value: function renderBody(displayTree) {
			var _props = this.props,
			    emptyTreeComponent = _props.emptyTreeComponent,
			    emptyTreeComponentProps = _props.emptyTreeComponentProps;


			if (displayTree.length) {
				return displayTree;
			} else if (emptyTreeComponent) {
				var emptyTreeElement = _react2.default.createElement(emptyTreeComponent, emptyTreeComponentProps);
				return emptyTreeElement;
			}

			return null;
		}
		/*
   *  @function render
   *  @description React render method for creating infinity menu
   */

	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var tree = this.props.tree;
			/* find filtered folders base on search, if there no search, return all */
			var filteredTree = this.state.search.isSearching && this.state.search.searchInput ? tree.reduce(function (prev, curr, key) {
				if (key === undefined) {
					return prev;
				}
				return _this4.findFiltered(prev, curr, key);
			}, []) : tree;

			/* recursive go through the tree */
			var displayTree = filteredTree.reduce(function (prev, curr, key) {
				if (key === undefined) {
					return prev;
				}
				return _this4.setDisplayTree(tree, prev, curr, key.toString());
			}, []);

			/* header component */
			var headerProps = _extends({
				isSearching: this.state.search.isSearching,
				searchInput: this.state.search.searchInput,
				setSearchInput: this.setSearchInput,
				stopSearching: this.stopSearching,
				startSearching: this.startSearching
			}, this.props.headerProps);

			var bodyContent = this.renderBody(displayTree);
			var defaultHeaderContent = this.props.disableDefaultHeaderContent ? null : _react2.default.createElement(_searchInput2.default, headerProps);
			var headerContent = this.props.headerContent ? _react2.default.createElement(this.props.headerContent, headerProps) : defaultHeaderContent;

			return _react2.default.createElement(
				"div",
				{ className: "infinity-menu-container" },
				headerContent,
				_react2.default.createElement(
					"div",
					{ className: "infinity-menu-display-tree-container" },
					bodyContent
				)
			);
		}
	}]);

	return InfinityMenu;
}(_react2.default.Component);

exports.default = InfinityMenu;


InfinityMenu.propTypes = {
	tree: _propTypes2.default.array,
	headerContent: _propTypes2.default.any,
	disableDefaultHeaderContent: _propTypes2.default.bool,
	headerProps: _propTypes2.default.object,
	customComponentMappings: _propTypes2.default.object,
	emptyTreeComponent: _propTypes2.default.any,
	emptyTreeComponentProps: _propTypes2.default.object,
	filter: _propTypes2.default.func,
	onNodeMouseClick: _propTypes2.default.func,
	onLeafMouseClick: _propTypes2.default.func,
	onLeafMouseDown: _propTypes2.default.func,
	onLeafMouseUp: _propTypes2.default.func,
	shouldComponentUpdate: _propTypes2.default.func,
	maxLeaves: _propTypes2.default.number
};

InfinityMenu.defaultProps = {
	tree: [],
	headerContent: null,
	disableDefaultHeaderContent: false,
	headerProps: {},
	emptyTreeComponent: null,
	emptyTreeComponentProps: {},
	filter: function filter(node, searchInput) {
		return node.name.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0;
	},
	onNodeMouseClick: function onNodeMouseClick() {},
	onLeafMouseClick: function onLeafMouseClick() {},
	onLeafMouseDown: function onLeafMouseDown() {},
	onLeafMouseUp: function onLeafMouseUp() {},
	maxLeaves: Infinity
};