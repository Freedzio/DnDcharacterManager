import { Container, Content } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ScreenHeader from '../common/components/ScreenHeader'
import { ApiConfig } from '../common/constants/ApiConfig'
import apiWrapper from '../common/functions/apiWrapper'
import { Features } from '../common/models/models'
import { StoreProps } from '../redux/store'
import Section from './Section'

export default function ChooseClassFeatures({ navigation }: any) {
  const [featuresData, setFeaturesData] = useState<Features>({} as Features)

  const className = useSelector((store: StoreProps) => store.class);

  useEffect(() => {
    apiWrapper(ApiConfig.levelFeaturesByClass(className.toLowerCase(), 1))
      .then(data => setFeaturesData(data))
  }, []);

  return (
    <Container>
      <Content>
        <ScreenHeader title='CHOOSE' />
        <Section title='Choose class features' />
      </Content>
    </Container>
  )
}