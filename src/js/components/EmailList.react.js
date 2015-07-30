var React = require('react');
var Modal = require('react-modal');
var HomeworkActions = require('../actions/HomeworkActions');
var HomeworkStore = require('../stores/HomeworkStore');
var ClassroomStore = require('../stores/ClassroomStore');
var ClassroomActions = require('../actions/ClassroomActions');
var AuthStore = require('../stores/AuthStore');
var _ = require('underscore');


var EmailForm = React.createClass({
  getInitialState: function(){
    return {
      newEmail: ''
    }
  },
  componentWillMount: function(){
    if(!AuthStore.checkAuth()){
      this.render = function () {
        return false;
      }
      location.hash = '/';
    }
  },
   handleAddEmail: function(e){
    e.preventDefault();
    var newEmail = React.findDOMNode(this.refs.newEmail).value;
    if(this.props.type === "parent"){

    }
    HomeworkActions.addStudentEmail({email: newEmail, studentId: this.props.studentId, classId: this.props.classId});
    React.findDOMNode(this.refs.newEmail).value = '';
    this.props.closeEmailModal();
  },
  render: function() {
    return (
      <div className="emailForm">
        <div className="well text-center">
          <button type="button" className="close" aria-label="Close" onClick={this.props.closeEmailModal}><span aria-hidden="true">&times;</span></button>
          <form onSubmit={this.handleAddEmail}> 
            <label>Add E-Mail</label>
            <div className="form-group">
              <input type="text" ref="newEmail" id="newEmail" className="form-control" placeholder="Example: johndoe@example.com" required />
            </div>
            <button type="submit" id="addNewEmail" className="btn btn-primary btn-block submit-button">Add email!</button>
          </form>
        </div> 
      </div>
    );
  }
});


var Student = React.createClass({
  getInitialState: function(){
    return {
      info: ClassroomStore.getInfo(),
      emails: HomeworkStore.getEmails(),
      parentEmail: undefined,
      emailModal: false,
      emailParentModal: false
    }
  },

  clicked: function(){
    console.log("clicked");
  },  

  addStudent: function(){
    console.log("addstudent clicked");
  },

  addParent: function(){
    console.log("add parent clicked");
  },

  openModal: function(){
    this.setState({emailModal: true});
  },

  closeModal: function() {
    this.setState({emailModal: false});
  },

  openParentModal: function(){
    this.setState({emailParentModal: true});
  },

  closeParentModal: function(){
    this.setState({emailParentModal: false});
  },

  render: function(){
    if(this.props.emails.email === undefined){
      var email = "No email added! Click here to add";
    } else {
      var email = this.props.emails.email;

    }
    if(this.props.parentEmail === undefined){
      var parentEmail = "No Parent email added! Click here to add";
    } else {
      var parentEmail = this.props.parentEmail;
    }
    return (
        
        <tr>
        <td>{this.props.studentTitle}<Modal className="emailModal" 
            isOpen={this.state.emailModal} 
            onRequestClose={this.closeModal}>
            <EmailForm closeEmailModal={this.closeModal} studentId={this.props.studentId} classId={this.state.info.classId} type="student"/>
          </Modal><Modal className="emailParentModal" 
            isOpen={this.state.emailParentModal} 
            onRequestClose={this.closeParentModal}>
            <EmailForm closeEmailModal={this.closeParentModal} studentId={this.props.studentId} classId={this.state.info.classId} type="parent"/></Modal></td>
        <td><a onClick={this.openModal}>{email}</a></td>
        <td><a className='fa fa-envelope-o' onClick={this.clicked}></a></td>
        <td><a onClick={this.openParentModal}>{parentEmail}</a></td>
        <td><a className='fa fa-envelope-o' onClick={this.clicked}></a></td>
        </tr>    

    );
  }
});


var EmailList = React.createClass({
  getInitialState: function(){
    return {
      list: ClassroomStore.getList(),
      info: ClassroomStore.getInfo(),
      emails: HomeworkStore.getEmails()
    }
  },
  _onChange: function(){
    this.setState({
        list: ClassroomStore.getList(),
        info: ClassroomStore.getInfo(),
        emails: HomeworkStore.getEmails()
    });
  },

  componentDidMount: function(){
    ClassroomStore.addChangeListener(this._onChange);    
    HomeworkStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ClassroomStore.removeChangeListener(this._onChange);
    HomeworkStore.removeChangeListener(this._onChange);
  },

  render: function(){
    var students = _.map(this.state.list, function(student,index,next){
      return (
        <Student key={index} studentId={index} studentTitle={student.studentTitle} emails={student.emails}/>
      );
    });
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">Students</h3>
        </div>
        <table className="table" id="emailtable">
            <thead>
            <tr>
              <th><h5>Name</h5></th>
              <th><h5>Student E-Mail</h5></th>
              <th><h5></h5></th>
              <th><h5>Parent E-mail</h5></th>
              <th><h5></h5></th>
            </tr>
            </thead>
            <tbody>
            {students}
            </tbody>
          </table>
      </div>
    );
  }
});


module.exports = EmailList;
