import React, { useEffect } from 'react';
import DummyView from '../common/components/DummyView';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/loading';
import { applySnapshot } from '../redux/snapshot';
import { StoreProps } from '../redux/store';

export default function SetAttributesScreen({ navigation }: any) {

  const snapshot = useSelector((store: StoreProps) => store.snapshot);

  const dispatch = useDispatch();
  const dispatchLoading = (loading: boolean) => dispatch(setLoading(loading));
  const dispatchSnapshot = () => dispatch(applySnapshot(snapshot))

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      dispatchLoading(false);
      dispatchSnapshot();

      return () => navigation.removeListener('beforeRemove');
    })
  }, [])

  return <DummyView />
}