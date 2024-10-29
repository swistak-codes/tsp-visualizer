import { PointControls } from './point-controls';
import { StartTypeControls } from './start-type-controls';
import { SaPropertiesControls } from './sa-properties-controls';
import { AnimationControls } from './animation-controls';

export const Controls = () => {
  return (
    <>
      <PointControls />
      <StartTypeControls />
      <SaPropertiesControls />
      <AnimationControls />
    </>
  );
};
