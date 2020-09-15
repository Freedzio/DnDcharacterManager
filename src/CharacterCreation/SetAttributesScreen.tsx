import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/loading';
import { applySnapshot, takeSnapshot } from '../redux/snapshot';
import { StoreProps } from '../redux/store';
import { Container, Content, Row, Col, Card, View, Text, Button, Input } from 'native-base';
import ScreenHeader from '../common/components/ScreenHeader';
import { Picker } from '@react-native-community/picker';
import getDimensions from '../common/functions/getDimensions';
import filterList from '../common/functions/filterList';
import { AbilityScores } from '../common/models/models';
import { setAbilityScore } from '../redux/abilityScores';
import { NAME_CHARACTER_SCREEN } from '../common/constants/routeNames';

export default function SetAttributesScreen({ navigation }: any) {
  const [distributionType, setDistributionType] = useState<string>('predefined');
  const [scores, setScores] = useState<{ [key: string]: string }>({
    'STR': '0',
    'DEX': '0',
    'CON': '0',
    'WIS': '0',
    'INT': '0',
    'CHA': '0',
  });

  const availableAmounts = ['15', '14', '13', '12', '10', '8'];
  const abilities = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

  const store = useSelector((store: StoreProps) => store);
  const race = useSelector((store: StoreProps) => store.race);
  const className = useSelector((store:StoreProps) =>Object.keys(store.classes)[0]);
  const snapshot = useSelector((store: StoreProps) => store.snapshot);
  const abilityScores = useSelector((store: StoreProps) => store.abilityScores);

  const dispatch = useDispatch();
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot));
  const dispatchTakeSnapshot = () => dispatch(takeSnapshot(store));
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchAbilityScores = (abilityScores: AbilityScores) => dispatch(setAbilityScore(abilityScores));

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();

      return () => navigation.removeListener('beforeRemove');
    })
  }, []);

  function onScoreChange(ability: string, score: string) {
    let newState = { ...scores }
    newState = {
      ...newState,
      [ability]: score
    };

    setScores(newState)
  };

  function getModifier(abilityScore: string, abilityBonus: number) {
    const modifier = Math.floor((parseInt(abilityScore) + abilityBonus - 10) / 2);

    return modifier > 0 ? '+' + modifier : modifier
  };

  function onNextPress() {
    dispatchTakeSnapshot();

    const keys = Object.keys(scores);
    let newScores = {}

    for(let i = 0; i < keys.length; i++) {
      newScores = {
        ...newScores,
        [keys[i]]: {
          score: parseInt(scores[keys[i]])
        } 
      }
    }

    dispatchAbilityScores(newScores);
    navigation.navigate(NAME_CHARACTER_SCREEN)
  }

  return (
    <Container>
      <Content>
        <ScreenHeader title='SET ATTRIBUTES' subtitle={`for your ${race} ${className}`} />
        <Row>
          <Col>
            <Button bordered={distributionType !== 'predefined'} style={{ margin: 10 }} block onPress={() => setDistributionType('predefined')}>
              <Text>predefined</Text>
            </Button>
          </Col>
          <Col>
            <Button bordered={distributionType !== 'custom'} style={{ margin: 10 }} block onPress={() => setDistributionType('custom')}>
              <Text>custom</Text>
            </Button>

          </Col>
        </Row>
        <View style={{ padding: 10, flexDirection: "row", width: getDimensions().width, flexWrap: 'wrap', justifyContent: "space-between" }}>
          {
           abilities.map((ability: string, index: number) =>
              <Card key={index} style={{ width: getDimensions().width / 3 - 20, height: 90 }}>
                <View style={{ flex: 1, justifyContent: "space-around" }}>
                  <Text style={{ textAlign: "center", flex: 2.5 }}>{ability}</Text>
                  {
                    distributionType === 'predefined' ?
                      <Picker selectedValue={scores[ability]} onValueChange={v => onScoreChange(ability, v as string)}>
                        <Picker.Item label='---' value={0} />
                        {
                          availableAmounts.filter(amount => filterList(amount, scores, ability)).map((amount: string, index: number) =>
                            <Picker.Item label={amount} value={amount} key={index} />
                          )
                        }
                      </Picker>
                      : <Input style={{ borderWidth: 1, borderColor: 'lightgrey', flex: 1 }} keyboardType='numeric' value={scores[ability]} onChangeText={v => onScoreChange(ability, v)} />
                  }
                </View>
              </Card>
            )
          }
        </View>
        <View style={{ flexDirection: "row", padding: 14 }}>
          <View style={{ flex: 1 }}>
            <Text>Ability</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Chosen score</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Score bonuses</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Modifier</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Total</Text>
          </View>
        </View>
        {
          Object.keys(abilityScores).map((ability: string, index: number) =>
            <View style={{ flexDirection: "row", padding: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{ability} {abilityScores[ability].proficiency ? '*' : ''} </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{scores[ability]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{abilityScores[ability].score}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{getModifier(scores[ability], abilityScores[ability].score)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{parseInt(scores[ability]) + abilityScores[ability].score}</Text>
              </View>
            </View>
          )
        }
        <Button block onPress={onNextPress}>
          <Text>next</Text>
        </Button>
      </Content>
    </Container>
  )
};