jest.dontMock('../../../main/js/components/login');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var User = require('../../../main/js/models/model-user');
//var Router = require('react-router');

var Login = require('../../../main/js/components/login');

describe('Login', function () {
    var loginForm,
        formInstance;

    beforeEach (function () {

        spyOn(User, 'login').andReturn({
            then: function () { }
        });

        loginForm = TestUtils.renderIntoDocument(
            <Login />
        );

        formInstance = loginForm.getDOMNode();
    });

    // TODO probably should NOT call this if the fields are empty
    it("should call User.login", function(){
        var button = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'button');
        TestUtils.Simulate.click(button);

        expect(User.login).toHaveBeenCalled();
    });

    it("should submit email and password to User.login", function(){
        var button = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'button');
        var inputFields = TestUtils.scryRenderedDOMComponentsWithTag(loginForm, 'input');
        var emailInput = inputFields[0];
        var passwordInput = inputFields[1];

        emailInput.getDOMNode().value = 'contact@neosavvy.com';
        passwordInput.getDOMNode().value = 'knowledgeIsModern';
        TestUtils.Simulate.click(button);

        expect(User.login).toHaveBeenCalledWith('contact@neosavvy.com', 'knowledgeIsModern');
    });
});


