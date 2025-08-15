import React from 'react';
import {
  SkinViewer,
  WalkingAnimation,
  IdleAnimation,
  RunningAnimation,
  WaveAnimation,
  FlyingAnimation,
  PlayerObject,
} from 'skinview3d';

class LookAtCameraAnimation extends IdleAnimation {
  instance: SkinViewer;

  constructor(instance: SkinViewer) {
    super();
    this.instance = instance;
  }

  protected animate(player: PlayerObject): void {
    super.animate(player);
    const head = player.skin.head;
    head.rotation.set(0, 0, 0);
    head.lookAt(this.instance.camera.position);
  }
}

type Props = {
  skin: string;
};
type AnimationType = (typeof animations)[number];
type ModelType = (typeof modelTypes)[number];

const animations = [
  'idle',
  'walking',
  'running',
  'wave',
  'fly',
  'look at camera',
] as const;
const modelTypes = ['classic', 'slim'] as const;

export default function SkinViewerComponent({ skin }: Props) {
  const [name, setName] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const instanceRef = React.useRef<SkinViewer | null>(null);
  const [currentAnimation, setCurrentAnimation] =
    React.useState<AnimationType>('idle');
  const [currentModelType, setCurrentModelType] =
    React.useState<ModelType>('classic');
  const [autoRotate, setAutoRotate] = React.useState(true);

  React.useEffect(() => {
    const canvas = canvasRef.current!;
    const instance = new SkinViewer({
      canvas,
      width: 300,
      height: 300,
      enableControls: true,
    });
    instance.controls.enablePan = true;
    instanceRef.current = instance;

    return () => {
      instance.dispose();
    };
  }, []);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
  }, []);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.loadSkin(skin, {
      model: currentModelType === 'slim' ? 'slim' : 'default',
    });
  }, [skin, currentModelType]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    switch (currentAnimation) {
      case 'idle': {
        instance.animation = new IdleAnimation();
        break;
      }
      case 'walking': {
        instance.animation = new WalkingAnimation();
        break;
      }
      case 'running': {
        instance.animation = new RunningAnimation();
        break;
      }
      case 'wave': {
        instance.animation = new WaveAnimation();
        break;
      }
      case 'fly': {
        instance.animation = new FlyingAnimation();
        break;
      }
      case 'look at camera': {
        instance.animation = new LookAtCameraAnimation(instance);
        break;
      }
    }
  }, [currentAnimation]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.autoRotate = autoRotate;
  }, [autoRotate]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.nameTag = name.trim() || null;
  }, [name]);

  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    const container = containerRef.current!;
    const observer = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      instance.setSize(rect.width, rect.height);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <div
        ref={containerRef}
        className="relative border-2 bg-neutral-900 border-neutral-800 rounded overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full! h-full! object-contain select-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p>Current animation</p>
        {animations.map((animation) => (
          <button
            key={animation}
            type="button"
            onClick={() => setCurrentAnimation(animation)}
            data-active={animation === currentAnimation}
          >
            {animation}
          </button>
        ))}

        <p>Model type</p>
        {modelTypes.map((modelType) => (
          <button
            key={modelType}
            type="button"
            onClick={() => setCurrentModelType(modelType)}
            data-active={modelType === currentModelType}
          >
            {modelType}
          </button>
        ))}

        <p>Auto rotate</p>
        <button
          onClick={() => {
            setAutoRotate((p) => !p);
          }}
          data-active={autoRotate}
        >
          {autoRotate ? 'enabled' : 'disabled'}
        </button>

        <input
          type="text"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </div>
    </div>
  );
}
