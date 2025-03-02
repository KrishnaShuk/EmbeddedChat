import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';
import RCContext from '../../context/RCInstance';
import { imageWrapper, imageStyles } from './ImageAttachment.styles';

const ImageAttachment = ({
  attachment,
  host,
  type,
  author,
  variantStyles = {},
  msg,
  isGif = false,
}) => {
  const { RCInstance } = useContext(RCContext);
  const [showGallery, setShowGallery] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log('ImageAttachment Render:', {
    attachment,
    host,
    isGif,
    imageUrl: attachment.image_url,
  });

  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  const { theme } = useTheme();

  const { authorIcon, authorName } = author;

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleImageClick = (e) => {
    if (isGif) {
      e.stopPropagation();
      return;
    }
    setShowGallery(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleImageClick(e);
    }
  };

  return (
    <Box css={variantStyles.imageAttachmentContainer}>
      <Box
        css={[
          css`
            cursor: pointer;
            border-radius: inherit;
            line-height: 0;
            padding: 0.5rem;
          `,
          (type ? variantStyles.pinnedContainer : '') ||
            css`
              ${type === 'file'
                ? `border: 2px solid ${theme.colors.border};`
                : ''}
            `,
        ]}
      >
        {type === 'file' ? (
          <>
            <Box
              css={[
                css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                `,
                variantStyles.textUserInfo,
              ]}
            >
              <Avatar
                url={getUserAvatarUrl(authorIcon)}
                alt="avatar"
                size="1.2em"
              />
              <Box>@{authorName}</Box>
            </Box>
          </>
        ) : null}
        <Box
          css={css`
            align-items: center;
            @media (max-width: 450px) {
              margin-top: 0.4rem;
            }
          `}
        >
          <AttachmentMetadata
            attachment={attachment}
            url={host + (attachment.title_link || attachment.image_url)}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        </Box>
        {isExpanded && (
          <button
            type="button"
            onClick={handleImageClick}
            onKeyPress={handleKeyPress}
            css={[
              imageWrapper({ isGif, theme }),
              css`
                border: none;
                background: none;
                padding: 0;
                cursor: ${!isGif ? 'pointer' : 'default'};
                &:focus {
                  outline: 2px solid ${theme.colors.primary};
                  outline-offset: 2px;
                }
              `,
            ]}
          >
            <img
              src={attachment.image_url}
              style={imageStyles({ isGif })}
              onError={(e) => {
                console.error('Image failed to load:', {
                  src: e.target.src,
                  isGif,
                  error: e.target.error,
                  originalUrl: attachment.image_url,
                });
                setImageError(true);
              }}
              alt={attachment.description || 'Attached image'}
            />
            {imageError && (
              <Box
                css={css`
                  color: ${theme.colors.danger};
                  padding: 8px;
                  font-size: 12px;
                `}
              >
                Failed to load image. URL: {host + attachment.image_url}
              </Box>
            )}
          </button>
        )}
        {attachment.attachments &&
          attachment.attachments.map((nestedAttachment, index) => (
            <Box css={variantStyles.imageAttachmentContainer} key={index}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => setShowGallery(true)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowGallery(true);
                  }
                }}
                css={[
                  css`
                    cursor: pointer;
                    border-radius: inherit;
                    line-height: 0;
                    padding: 0.5rem;
                  `,
                  (nestedAttachment.attachments[0].type
                    ? variantStyles.pinnedContainer
                    : variantStyles.quoteContainer) ||
                    css`
                      ${nestedAttachment.attachments[0].type === 'file'
                        ? `border: 2px solid ${theme.colors.border};`
                        : ''}
                    `,
                ]}
              >
                {nestedAttachment.type === 'file' ? (
                  <>
                    <Box
                      css={[
                        css`
                          display: flex;
                          gap: 0.3rem;
                          align-items: center;
                        `,
                        variantStyles.textUserInfo,
                      ]}
                    >
                      <Avatar
                        url={getUserAvatarUrl(nestedAttachment.author_icon)}
                        alt="avatar"
                        size="1.2em"
                      />
                      <Box>@{nestedAttachment.author_name}</Box>
                    </Box>
                  </>
                ) : null}
                <AttachmentMetadata
                  attachment={nestedAttachment}
                  url={
                    host +
                    (nestedAttachment.title_link || nestedAttachment.image_url)
                  }
                  variantStyles={variantStyles}
                />
                <img
                  src={host + nestedAttachment.image_url}
                  style={{
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderBottomLeftRadius: 'inherit',
                    borderBottomRightRadius: 'inherit',
                  }}
                  alt={
                    nestedAttachment.description || 'Nested attachment image'
                  }
                />
              </Box>
              {showGallery && (
                <ImageGallery
                  currentFileId={extractIdFromUrl(nestedAttachment.title_link)}
                  setShowGallery={setShowGallery}
                />
              )}
            </Box>
          ))}
      </Box>
      {showGallery && (
        <ImageGallery
          currentFileId={extractIdFromUrl(attachment.title_link)}
          setShowGallery={setShowGallery}
        />
      )}
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
