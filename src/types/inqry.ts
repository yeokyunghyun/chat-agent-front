export type TreeNode = {
  id: string;
  title: string;
  content: string;
  type: string;
  children?: TreeNode[];
};