import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import RouterLink from '../link.jsx'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import {Censor} from '../censorship.jsx'
import EditButton from '../edit-button.jsx'
import ChildCard from '../child-card.jsx'
import Mods from './mods.jsx'

const useStyles = makeStyles({
  box: {
    display: 'inline-block'
  },
  card: {
    maxWidth: 450,
  },
  live2d: {
    minHeight: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const Child = ({child, mods}) => {
  const classes = useStyles()
  if(!child) return <div>Loading ...</div>
  const name = child.get('name'),
        id = child.get('id'),
        variants = child.get('variants')
  return (
    <div>
      <EditButton />
      <Breadcrumbs aria-label="Breadcrumb">
        <Link component={RouterLink} to="/">Home</Link>
        <Link component={RouterLink} to="/childs">Childs</Link>
        <Typography color="textPrimary">{name} ({id})</Typography>
      </Breadcrumbs>
      <Box mt={2}>
        <ChildCard child={child} />
      </Box>
      <Box mt={2}>
        <Typography variant="h5">{name} Variants</Typography>
      </Box>
      {variants.toOrderedMap().sortBy((v, k) => k)
        .map((variant, vId) => variant && variant.get &&
          <Box m={1} key={id + vId} className={classes.box}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Button
                  href={`./live2d/?model=${id}_${vId}`}
                  target="_blank">
                  {variant.get('title')} {name} ({id}_{vId})
                  <Box ml={2}><OpenInNewIcon /></Box>
                </Button>
                <Grid container>
                  <Grid item xs={4}>
                    <Censor min={1}>
                      <img src={`./img/childs/portraits/${id}_${vId}.png`}
                        height="250"
                        alt={`${variant.get('title')} ${name} Portrait`} />
                    </Censor>
                  </Grid>
                  <Grid item xs={8}>
                    <Censor min={1}>
                      <iframe
                        style={{
                          width: '100%',
                          height: '100%',
                          maxWidth: '100%',
                          border: 'none',
                          overflow: 'hidden'
                        }}
                        className={classes.live2d}
                        scrolling="no"
                        seamless="seamless"
                        src={`./live2d/viewer.html?mN=${id}_${vId}&size=500`} />
                    </Censor>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ).toList()
      }
      <Mods mods={mods} child={child} />
    </div>
  )
}

export default connect(
  state => {
    const child = state.get('childs').get(state.get('location').payload.id)
    return {
      child,
      mode: state.get('child').get('mode'),
      mods: child && state.get('mods').get(child.get('id'))
    }
  }
)(Child)
