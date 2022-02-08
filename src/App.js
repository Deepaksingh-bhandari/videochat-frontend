import logo from './logo.svg';
import './App.css';
import { Typography, AppBar } from '@material-ui/core'
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notification from './components/Notification';
import { makeStyles } from '@material-ui/core';

const useStyle=makeStyles((theme)=>({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

function App() {
  const classes=useStyle()
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position='static' color='inherit'> 
      <Typography variant='h2' align='center'>Video Chat</Typography>
      </AppBar>
      <VideoPlayer/>
      <Options>
      <Notification/>
      </Options> 
    </div>
  );
}

export default App;
