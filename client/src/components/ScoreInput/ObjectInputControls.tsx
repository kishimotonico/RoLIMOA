import { TaskObjectConfigType } from 'config/types';
import { PluseMinuseButtonControl } from './PluseMinuseButtonControl';
import React, { FC } from 'react';

type ObjectInputControlProps = {
  fieldSide: "blue" | "red",
  config: TaskObjectConfigType,
};

export const ObjectInputControl: FC<ObjectInputControlProps> = ({
  fieldSide,
  config,
}) => {
  return (
    <PluseMinuseButtonControl
      fieldSide={fieldSide}
      config={config}
    />
  )
};
