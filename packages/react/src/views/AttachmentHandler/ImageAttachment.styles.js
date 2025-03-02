import { css } from '@emotion/react';

export const imageWrapper = ({ isGif, theme }) => css`
  width: ${isGif ? '200px' : '300px'};
  height: ${isGif ? '200px' : 'auto'};
  overflow: hidden;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.surface};
`;

export const imageStyles = ({ isGif }) => ({
  width: isGif ? '200px' : '100%',
  height: isGif ? '200px' : 'auto',
  maxHeight: isGif ? '200px' : '200px',
  objectFit: isGif ? 'cover' : 'scale-down',
  borderRadius: 'inherit',
  imageRendering: isGif ? 'auto' : 'inherit',
});
