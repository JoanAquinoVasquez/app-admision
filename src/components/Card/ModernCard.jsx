import React from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../theme';

/**
 * Modern Card Component with glassmorphism effect
 */
export const Card = ({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    padding = 'md',
    className,
    ...props
}) => {
    const paddingSizes = {
        sm: theme.spacing.sm,
        md: theme.spacing.lg,
        lg: theme.spacing.xl,
    };

    const styles = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.md,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        transition: theme.transitions.base,
        cursor: hoverable ? 'pointer' : 'default',
    };

    const hoverStyles = hoverable ? {
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows.lg,
        }
    } : {};

    return (
        <div
            style={styles}
            className={className}
            onMouseEnter={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = theme.shadows.lg;
                }
            }}
            onMouseLeave={(e) => {
                if (hoverable) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                }
            }}
            {...props}
        >
            {title && (
                <div style={{
                    padding: paddingSizes[padding],
                    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.neutral[900],
                    }}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p style={{
                            margin: `${theme.spacing.xs} 0 0 0`,
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.neutral[600],
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div style={{ padding: paddingSizes[padding] }}>
                {children}
            </div>

            {footer && (
                <div style={{
                    padding: paddingSizes[padding],
                    borderTop: `1px solid ${theme.colors.neutral[200]}`,
                    backgroundColor: theme.colors.neutral[50],
                }}>
                    {footer}
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    footer: PropTypes.node,
    hoverable: PropTypes.bool,
    padding: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Card;
