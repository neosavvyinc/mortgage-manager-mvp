jest.dontMock('../../../main/js/components/component-login');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
//var Router = require('react-router');

var Login = require('../../../main/js/components/component-login');

describe('Login', function () {
    var loginForm,
        formInstance,
        inputFields,
        emailInput,
        passwordInput;

    beforeEach (function () {
        Login.onLogin = jest.genMockFunction();
        loginForm = TestUtils.renderIntoDocument(
            <Login />
        );

        formInstance = loginForm.getDOMNode();

        inputFields = TestUtils.scryRenderedDOMComponentsWithTag(loginForm, 'input');

    });

    xit("should execute onLogin when clicked", function(){
        var button = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'button');
        TestUtils.Simulate.click(button);

        //expect(Login.onLogin).toBeCalled();
    });
    xit("should submit email and password", function(){
        emailInput = inputFields[0];
        passwordInput = inputFields[1];

        TestUtils.Simulate.change(emailInput, {target: {value: 'contact@neosavvy.com'}});
        TestUtils.Simulate.change(passwordInput, {target: {value: 'knowledgeIsModern'}});

        //expect(true).toBe(false);
    });
});


