// 组件相关类型定义

// ============= 表单组件类型 =============
export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export interface ModalProps {
  visible: boolean;
  title?: string;
  width?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

// ============= 列表组件类型 =============
export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: any, record: any, index: number) => any;
}

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

// ============= 编辑器类型 =============
export interface MarkdownEditorProps {
  value: string;
  height?: number | string;
  language?: string;
  theme?: 'light' | 'dark';
  preview?: boolean;
  onChange?: (value: string) => void;
}

// ============= 图片查看器类型 =============
export interface ImageViewerProps {
  src: string;
  alt?: string;
  preview?: boolean;
  width?: number | string;
  height?: number | string;
}

// ============= 导航组件类型 =============
export interface BreadcrumbItem {
  key: string;
  label: string;
  path?: string;
}

export interface SidebarItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: SidebarItem[];
  badge?: number | string;
}

// ============= WebSocket组件类型 =============
export interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
  error?: string;
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
} 