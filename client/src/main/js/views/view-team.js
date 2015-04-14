var React = require('react');

var HeaderLogout = require('../components/header-logout'),
    Footer = require('../components/footer');

var Team = React.createClass({
    render: function(){
        return (
            <span>
                <div className="fill">
                    <div className="header">
                        <HeaderLogout />
                    </div>
                    <div className="content-body">
                        <div className="container">
                            <div className="panel panel-default bg-white">
                                <div className="panel-body triple-pad-bottom">
                                    <div className="row">
                                        <h2 className="bordered-bottom col-xs-12 text-center">Co Authors</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-offset-2 col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/palonso.png" width="300" height="300" />
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Pablo Alonso</h4>
                                            <p>Pablo hails from the Basque region of Spain and is one of two new team mates this year at Neosavvy. He has worked alongside the rest of the team on projects at HBO, Honest Buildings and various smaller customers. He graduated with a BSc in Computer Engineering from NYU in 2014. He is one of the co-authors of DocSwap and vehemently opposes non-spanish style ham.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/sushi.png" width="300" height="300" />
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Sushindhran Harikrishnan</h4>
                                            <p>Sushindhran joined us from his home in India after earning his Bachelor of Technology from Amrita School of Engineering he came to NY to earn a Masters in Computer Science from NYU. He has a penchant for trending technologies in Game, Web and Mobile development and also helped us Co-Author DocSwap.co. Sushi makes a particularly outstanding custard pie. He also allows us to call him Sushi.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h2 className="bordered-bottom col-xs-12 text-center">Additional Technical Team</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/aparrish.png" width="300" height="300" />
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Adam Parrish</h4>
                                            <p>Adam has nearly fifteen years of computer science and software development experience and founded <a href="www.neosavvy.com">Neosavvy</a> in 2008. He is a graduate of North Carolina State University where he studied computer science and he has served as a developer, software engineer, and consultant for IBM, ITS, Roundarch, Motricity, Morgan Stanley, HBO, and many other large firms and startups. At Neosavvy he has delivered numerous projects, including various EC2- and Rackspace-support cloud services utilizing HTML5 AngularJS, and other languages. In addition to serving as lead software developer on many projects, Adam actively leads Neosavvy’s business, client, and employee interests.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/tewen.png" width="300" height="300" />
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Trevor Ewen</h4>
                                            <p>Trevor is a native Chicagoan and joined Neosavvy at the beginning of 2013. Over the course of his career he has participated in development efforts for Keyser Group, Bloomberg Sports, Pearson, Morgan Stanley, RunEnergy, and others. He is a graduate of Northwestern University where his combined study of computer science, film production, and history informs his diverse background and dynamic ability to facilitate communication and lead engineering efforts among various project team members and stakeholders. His past software experience begins with Adobe Flex and extends to Java Enterprise development, as well as Ruby on Rails and Python. As a developer, he is also proficient in Angular JS and other HTML5 technologies. Trevor lives with his wife in Queens and enjoys concerts, cowboy boots, and barbeque.</p>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/ccaplinger.png" width="100%" />
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Chris Caplinger</h4>
                                            <p>Chris is an experienced computer scientist and software engineer and joined Neosavvy in fall 2013 because he believes software development is not just a job, but a statement of passion. As a graduate of Boston University with a focus in electrical engineering, Chris is able to bring a both technical and practical insight for his clients, which have included Verizon, Morgan Stanley, Memmee.com, the Sneeky App (available in the Apple App store), and many others. His specialties include Core Javascript, Angular, and Scala, and he is an avid vim user. He is active in the OSS community and his experience in the renewable energy and sustainability sectors complements his collaborative, organic approach to development projects. Chris lives in Brooklyn by way of Columbus, and as a New Orleans native, he’s as passionate about music as he is about coding.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h2 className="bordered-bottom col-xs-12 text-center">Advisory Panel</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-offset-4 col-md-4 col-sm-6 col-xs-12 triple-pad-bottom">
                                            <div className="row text-center">
                                                <img src="assets/images/gmorris.jpg" width="100%"/>
                                            </div>
                                            <h4 className="bordered-bottom double-pad-top text-center">Gene Morris</h4>
                                            <p>Gene has been a close advisor to DocSwap since inception. He has a 27 year career in the Mortgage industry with Bank of America and a BA from UNC Charlotte. With his industry experience and positive attitude he'll be a guiding light to DocSwap as we try to revolutionize the way Mortgage's are originated.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="push" />
                </div>
                <div className="footer">
                    <Footer />
                </div>
            </span>
        );
    }
});

module.exports = Team;