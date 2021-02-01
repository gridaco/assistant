export interface DragAndDropOnCanvasRequest<T = any> {
  dropPosition: {
    clientX: number;
    clientY: number;
  };
  windowSize: {
    width: number;
    height: number;
  };
  offset: {
    x: number;
    y: number;
  };
  itemSize: {
    width: number;
    height: number;
  };
  eventKey: string;
  customData: T;
}

export type DragAndDropHandlerCallback = (
  customData: any,
  position: { x: number; y: number }
) => Promise<any>;
