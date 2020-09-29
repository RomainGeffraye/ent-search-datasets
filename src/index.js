import React from "react";
import ReactDOM from "react-dom";
import Alert from "@material-ui/lab/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { createStyles, withStyles } from "@material-ui/core/styles";

import {
  Typography,
  Button,
  LinearProgress,
  Divider,
  Toolbar,
  Container
} from "@material-ui/core";
import "./styles.css";
import logo from "./logo-elastic-vertical-color.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {" Elastic "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const BorderLinearProgress = withStyles(() =>
  createStyles({
    root: {
      height: 10
    },
    bar: {
      backgroundColor: "#FEC514"
    }
  })
)(LinearProgress);

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: "info",
      msg: "null",
      disable_submit: false,
      show: false,
      show_progress: false,
      progress: 0
    };
    this.myChangeHandler = this.myChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  pullStatusHandler = () => {
    setInterval(this.pullStatus, 1000);
  };

  pullStatus = () => {
    if (this.state.show_progress) {
      var data = {
        event_id: this.state.event_id
      };
      var url = new URL(
        "https://2uarkpt21f.execute-api.eu-central-1.amazonaws.com/default/ASA-get-status"
      );
      Object.keys(data).forEach((key) =>
        url.searchParams.append(key, data[key])
      );
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data["progress"] < 100) {
            this.setState({
              progress: data["progress"],
              msg: data["msg"]
            });
          } else {
            this.setState({
              show_progress: false,
              disable_submit: false,
              alert: "success",
              msg: "Analytics has been updated"
            });
          }
        });
    }
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      [nam]: val
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    var data = {
      elastic_url: this.state.elastic_url,
      pwd: this.state.password,
      username: this.state.username,
      host: this.state.app_search,
      search_key: this.state.search_key,
      engine_name: this.state.engine_name
    };
    var url = new URL(
      "https://7vzg3s9t47.execute-api.eu-central-1.amazonaws.com/default/app-search-analytics"
    );
    console.log("start");
    Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        var response_code = data["status"];
        this.setState({ event_id: data["event_id"] });
        var messages = {
          "1": "The Elasticsearch URL is incorrect",
          "2": "Wrong combination of username/passsword",
          "3": "The App Search url is incorrect",
          "4": "The search key is not correct",
          "5": "The App Search engine doesn't exists",
          "6": "Analytics is being updated"
        };
        this.setState({
          show: true,
          show_progress: response_code === 6,
          disable_submit: response_code === 6,
          alert: response_code === 6 ? "info" : "error",
          msg: messages[response_code]
        });
        console.log(data);
        if (response_code === 6) {
          this.pullStatusHandler();
        }
      })
      .catch(function (error) {
        this.setState({
          show: true,
          alert: "error",
          msg: "An error occured"
        });
        console.log("Request failed", error);
      });
    console.log("finish");
  }

  render() {
    return (
      <div>
        <Toolbar position="static" className="Toolbar">
          <Typography component="h1" variant="6">
            App Search Workshop - Add Analytics
          </Typography>
        </Toolbar>
        {this.state.show_progress ? (
          <BorderLinearProgress
            variant="determinate"
            value={this.state.progress}
          />
        ) : null}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div>
            <Typography component="h1" variant="6"></Typography>
            {this.state.show ? (
              <Alert severity={this.state.alert}> {this.state.msg} </Alert>
            ) : null}
            <form onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="elastic_url"
                onChange={this.myChangeHandler}
                id="elastic_url"
                label="Elastic URL"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="username"
                onChange={this.myChangeHandler}
                label="Username"
                id="username"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                onChange={this.myChangeHandler}
                label="Password"
                id="password"
              />
              <Divider />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="app_search"
                onChange={this.myChangeHandler}
                id="app_search"
                label="App Search URL"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="search_key"
                onChange={this.myChangeHandler}
                label="Search Key"
                id="search_key"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="engine_name"
                onChange={this.myChangeHandler}
                label="Engine Name"
                id="engine_name"
              />
              <Button
                disabled={this.state.disable_submit}
                type="submit"
                fullWidth
                style={{
                  backgroundColor: " #00bfb3",
                  color: "white"
                }}
                variant="contained"
              >
                Submit
              </Button>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px"
              }}
            >
              <img src={logo} alt="Logo" width="50" height="60" />
            </div>
          </Box>
        </Container>
      </div>
    );
  }
}

ReactDOM.render(<NameForm />, document.getElementById("app"));
