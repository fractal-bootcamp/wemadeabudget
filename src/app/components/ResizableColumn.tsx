import { Resizable, ResizeCallbackData, ResizeHandle } from 'react-resizable'
import 'react-resizable/css/styles.css'

interface ResizableColumnProps {
  width: number
  minWidth?: number
  maxWidth: number
  onResize: (event: React.SyntheticEvent, data: ResizeCallbackData) => void
  children: React.ReactNode
}

const ResizableColumn: React.FC<ResizableColumnProps> = ({
  width,
  minWidth = 50,
  maxWidth,
  onResize,
  children,
}) => {
  const handleResize = (
    event: React.SyntheticEvent,
    { size }: ResizeCallbackData
  ) => {
    const newWidth = Math.max(Math.min(size.width, maxWidth), minWidth)
    onResize(event, {
      size: { width: newWidth, height: size.height },
      node: event.currentTarget as HTMLElement,
      handle: null as unknown as ResizeHandle,
    }) // Type assertion for handle
  }
  return (
    <Resizable
      width={width}
      height={0}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, 0]}
      handle={
        <div className="absolute bottom-0 right-0 top-0 w-1 cursor-col-resize" />
      }
      onResize={handleResize}
    >
      <div
        style={{ width }}
        className="overflow-hidden border-r border-gray-300 pl-2 pr-2"
      >
        <div className="truncate">{children}</div>
      </div>
    </Resizable>
  )
}

export default ResizableColumn
