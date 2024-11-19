import type { Meta, StoryObj } from "@storybook/react";
import { boxStyle } from "@/components/layout/box.stories.css.js";
import { Box } from "./box.js";

const meta = {
  title: "Layout/Box",
  component: Box,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Box
export const Default: Story = {
  args: {
    padding: "md",
    className: boxStyle,
    children: "Default Box",
  },
};

// Flex Box
export const FlexBox: Story = {
  args: {
    display: "flex",
    alignItems: "center",
    gap: "lg",
    justifyContent: "center",
    padding: "lg",
    className: boxStyle,
    children: (
      <>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </>
    ),
  },
};

// Responsive Box
export const ResponsiveBox: Story = {
  args: {
    padding: { mobile: "sm", tablet: "md", desktop: "lg" },
    margin: { mobile: "sm", tablet: "md", desktop: "lg" },
    className: boxStyle,
    children: "Responsive Box",
  },
};

// Styled Box
export const StyledBox: Story = {
  args: {
    padding: "md",
    transition: "slow",
    cursor: "pointer",
    className: boxStyle,
    children: "Styled Box",
  },
};

// Layout Box
export const LayoutBox: Story = {
  args: {
    position: "relative",
    width: "full",
    className: boxStyle,
    children: "Layout Box",
  },
};

// Nested Boxes
export const NestedBoxes: Story = {
  args: {
    display: "flex",
    flexDirection: "column",
    gap: "sm",
    className: boxStyle,
    children: (
      <>
        <Box padding="sm">Box 1</Box>
        <Box padding="sm">Box 2</Box>
        <Box padding="sm">Box 3</Box>
      </>
    ),
  },
};
