/**
 * generator-verb <https://github.com/assemble/generator-ver>
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var _ = require('lodash');
var yeoman = require('yeoman-generator');


var VerbGenerator = module.exports = function VerbGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'] || this.options['s'],
      skipMessage: this.options['skip-welcome-message'] || this.options['w']
    });
  });
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};
util.inherits(VerbGenerator, yeoman.generators.Base);



VerbGenerator.prototype.askFor = function askFor() {
  var cb = this.async();
  var prompts = [];

  // have Yeoman greet the user, unless skipped
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
  }

  var username = this.user.git.username || process.env.user || process.env.username || 'placeholder';
  prompts.push({
    name: 'authorname',
    message: 'What is the author\'s name?',
    default: username
  });

  prompts.push({
    name: 'projectname',
    message: 'What is the name of the project?',
    default: this.appname
  });

  prompts.push({
    name: 'username',
    message: 'What username or org is the repo using on GitHub?',
    default: username
  });

  prompts.push({
    name: 'projectdesc',
    message: 'Want to add a description?',
    default: 'Generate new Assemble projects using best practices and sensible defaults.'
  });

  this.prompt(prompts, function (props) {
    this.projectname = props.projectname;
    this.projectdesc = props.projectdesc;
    this.authorname = props.authorname;
    this.username = props.username;
    cb();
  }.bind(this));
};



VerbGenerator.prototype.app = function app() {
  this.mkdir('docs');

  if (!fs.existsSync('docs/README.tmpl.md')) {
    this.template('README.tmpl.md', 'docs/README.tmpl.md');
  }
  var pkgTemplate = '../../app/templates/_package.json';
  var pkgString = this.readFileAsString(path.join(this.sourceRoot(), pkgTemplate));
  var expandedPkg = this.engine(pkgString, this);

  if (fs.existsSync('package.json')) {
    var pkg = JSON.parse(this.readFileAsString('package.json'));
    pkg.devDependencies = pkg.devDependencies || {};
    _.defaults(pkg, JSON.parse(expandedPkg));
    _.extend(pkg.devDependencies, JSON.parse(expandedPkg).devDependencies);

    fs.unlink('package.json');
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  } else {
    this.template(pkgTemplate, 'package.json');
  }
};


VerbGenerator.prototype.verbfile = function verbfile() {
  if (!fs.existsSync('.verbrc.yml')) {
    this.copy('../../app/templates/verbrc.yml', '.verbrc.yml');
  }
};

VerbGenerator.prototype.jshintrc = function jshintrc() {
  if (!fs.existsSync('.jshintrc')) {
    this.copy('../../app/templates/jshintrc', '.jshintrc');
  }
};

VerbGenerator.prototype.git = function git() {
  if (!fs.existsSync('.gitignore')) {
    this.copy('../../app/templates/gitignore', '.gitignore');
  }

  if (!fs.existsSync('.gitattributes')) {
    this.copy('../../app/templates/gitattributes', '.gitattributes');
  }
};

VerbGenerator.prototype.license = function license() {
  if (!fs.existsSync('LICENSE-MIT')) {
    this.template('../../app/templates/LICENSE-MIT');
  }
};