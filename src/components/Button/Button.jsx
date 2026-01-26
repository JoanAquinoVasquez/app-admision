import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { theme } from '../../theme';

/**
 * Modern Button Component
 * Follows design system with variants and sizes
 */
export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className,
    ...props
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.typography.fontFamily.primary,
        fontWeight: theme.typography.fontWeight.medium,
        borderRadius: theme.borderRadius.lg,
        transition: theme.transitions.base,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        border: 'none',
        outline: 'none',
    };

    const variants = {
        primary: {
            backgroundColor: theme.colors.primary[600],
            color: '#ffffff',
            boxShadow: theme.shadows.sm,
        },
        secondary: {
            backgroundColor: theme.colors.secondary[600],
            color: '#ffffff',
            boxShadow: theme.shadows.sm,
        },
        outline: {
            backgroundColor: 'transparent',
            color: theme.colors.primary[600],
            border: `2px solid ${theme.colors.primary[600]}`,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: theme.colors.primary[600],
        },
        danger: {
            backgroundColor: theme.colors.error,
            color: '#ffffff',
            boxShadow: theme.shadows.sm,
        },
    };

    const sizes = {
        sm: {
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            fontSize: theme.typography.fontSize.sm,
        },
        md: {
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.base,
        },
        lg: {
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            fontSize: theme.typography.fontSize.lg,
        },
    };

    const styles = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            style={styles}
            className={className}
            {...props}
        >
            {loading ? (
                <>
                    <span style={{ marginRight: theme.spacing.sm }}>⏳</span>
                    Cargando...
                </>
            ) : (
                children
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
