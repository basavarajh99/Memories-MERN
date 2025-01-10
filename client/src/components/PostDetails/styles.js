import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  title: {
    fontSize: '3rem', 
    wordBreak: 'break-word', 
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem', 
    },
  },
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',

  },
  card: {
    display: 'flex',
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
    maxWidth: '100%', 
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
       marginLeft: 0,
       marginTop: '10px',
    },
  },
  imageSection: {
    marginLeft: '20px',
    flex: 1,
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
       marginTop: '10px',
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px', 
    borderRadius: '15px', 
    height: '39vh',
  },

  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
  }

}));