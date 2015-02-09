jest.dontMock('../../../main/js/components/login');
jest.dontMock('../../../main/js/components/message-box');

var React = require('react/addons');
var func = React.PropTypes.func;
var TestUtils = React.addons.TestUtils;
var User = require('../../../main/js/models/model-user');
var Router = require('react-router');

var LoginPath = '../../../main/js/components/login';

var _createTestWrapper = function(path) {
	var Component = require(path);

	return TestWrapper = React.createClass({
		childContextTypes: {
			makePath: func,
			makeHref: func,
			transitionTo: func,
			replaceWith: func,
			goBack: func,
			getCurrentPath: func,
			getCurrentRoutes: func,
			getCurrentPathname: func,
			getCurrentParams: func,
			getCurrentQuery: func,
			isActive: func,
		},

		getChildContext: function () {
			return {
				makePath: function () {
				},
				makeHref: function () {
				},
				transitionTo: function () {
				},
				replaceWith: function () {
				},
				goBack: function () {
				},
				getCurrentPath: function () {
				},
				getCurrentRoutes: function () {
				},
				getCurrentPathname: function () {
				},
				getCurrentParams: function () {
				},
				getCurrentQuery: function () {
				},
				isActive: function () {
				},
			};
		},

		render: function () {
			return (<Component />);
		}
	});
};

describe('Login', function () {
	var loginForm,
		button,
		inputFields,
		messageBox,
		email,
		password,
		LoginWrapper = _createTestWrapper(LoginPath);

	beforeEach (function () {
		spyOn(User, 'login').andReturn({
			then: function () { }
		});

		loginForm = TestUtils.renderIntoDocument(<LoginWrapper />);
		button = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'button');
		inputFields = TestUtils.scryRenderedDOMComponentsWithTag(loginForm, 'input');
		messageBox = TestUtils.scryRenderedDOMComponentsWithClass(loginForm, 'error');
		email = inputFields[0];
		password = inputFields[1];
	});

	afterEach(function() {
		if(loginForm && loginForm.isMounted()) {
			React.unmountComponentAtNode(loginForm.getDOMNode());
		}
	});

	it('should call User.login', function() {
		TestUtils.Simulate.click(button);
		expect(User.login).toHaveBeenCalled();
	});

	it('should not call User.login if email field is empty', function() {
		email.getDOMNode().value = '';
		password.getDOMNode().value = '*****';

		TestUtils.Simulate.click(button);
		expect(messageBox[0].props.className).toBe('message gap-bottom error hidden');
		expect(messageBox[0].props.children).toBe('You must enter the username and password');
	});

	it('should not call User.login if password field is empty', function() {
		email.getDOMNode().value = 'contact@neosavvy.com';
		password.getDOMNode().value = '';

		TestUtils.Simulate.click(button);
		expect(messageBox[0].props.className).toBe('message gap-bottom error hidden');
		expect(messageBox[0].props.children).toBe('You must enter the username and password');
	});

	it('should not call User.login if any of the fields are empty', function() {
		email.getDOMNode().value = '';
		password.getDOMNode().value = '';

		TestUtils.Simulate.click(button);
		expect(messageBox[0].props.className).toBe('message gap-bottom error hidden');
		expect(messageBox[0].props.children).toBe('You must enter the username and password');
	});

	it('should submit email and password to User.login', function() {
		email.getDOMNode().value = 'contact@neosavvy.com';
		password.getDOMNode().value = 'knowledgeIsModern';
		TestUtils.Simulate.click(button);

		expect(User.login).toHaveBeenCalledWith('contact@neosavvy.com', 'knowledgeIsModern');
	});
});


