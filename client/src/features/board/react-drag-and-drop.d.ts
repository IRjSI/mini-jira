declare module 'react-drag-and-drop' {
  import * as React from 'react';

  export interface DraggableProps {
    type: string;
    data?: string;
    children?: React.ReactNode;
    onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
  }

  export interface DroppableProps {
    types: string[];
    onDrop?: (data: any, event: React.DragEvent<HTMLElement>) => void;
    children?: React.ReactNode;
  }

  export class Draggable extends React.Component<DraggableProps> {}
  export class Droppable extends React.Component<DroppableProps> {}
}
