import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createHero, deleteHero, getHeros, patchHero } from '../api/heroes-api'
import Auth from '../auth/Auth'
import { Hero } from '../types/Hero'

interface HerosProps {
  auth: Auth
  history: History
}

interface HerosState {
  Heros: Hero[]
  newHeroName: string
  loadingHeros: boolean
}

export class Heros extends React.PureComponent<HerosProps, HerosState> {
  state: HerosState = {
    Heros: [],
    newHeroName: '',
    loadingHeros: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newHeroName: event.target.value })
  }

  onEditButtonClick = (heroId: string) => {
    this.props.history.push(`/heroes/${heroId}/edit`)
  }

  onHeroCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newHero = await createHero(this.props.auth.getIdToken(), {
        name: this.state.newHeroName,
        dueDate
      })
      this.setState({
        Heros: [...this.state.Heros, newHero],
        newHeroName: ''
      })
    } catch {
      alert('Hero creation failed')
    }
  }

  onHeroDelete = async (heroId: string) => {
    try {
      await deleteHero(this.props.auth.getIdToken(), heroId)
      this.setState({
        Heros: this.state.Heros.filter(Hero => Hero.heroId !== heroId)
      })
    } catch {
      alert('Hero deletion failed')
    }
  }

  onHeroCheck = async (pos: number) => {
    try {
      const Hero = this.state.Heros[pos]
      await patchHero(this.props.auth.getIdToken(), Hero.heroId, {
        name: Hero.name,
        dueDate: Hero.dueDate,
        done: !Hero.done
      })
      this.setState({
        Heros: update(this.state.Heros, {
          [pos]: { done: { $set: !Hero.done } }
        })
      })
    } catch {
      alert('Hero deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const Heros = await getHeros(this.props.auth.getIdToken())
      this.setState({
        Heros,
        loadingHeros: false
      })
    } catch (e) {
      alert(`Failed to fetch Heros:`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Notes</Header>

        {this.renderCreateHeroInput()}

        {this.renderHeros()}
      </div>
    )
  }

  renderCreateHeroInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add Your Herror',
              onClick: this.onHeroCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Super Man, Batman,..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHeros() {
    if (this.state.loadingHeros) {
      return this.renderLoading()
    }

    return this.renderHerosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Heroes
        </Loader>
      </Grid.Row>
    )
  }

  renderHerosList() {
    return (
      <Grid padded>
        {this.state.Heros.map((Hero, pos) => {
          return (
            <Grid.Row key={Hero.heroId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onHeroCheck(pos)}
                  checked={Hero.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {Hero.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Hero.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(Hero.heroId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onHeroDelete(Hero.heroId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {Hero.attachmentUrl && (
                <Image src={Hero.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
