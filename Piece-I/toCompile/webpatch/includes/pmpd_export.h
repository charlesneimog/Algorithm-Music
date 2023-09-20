
#ifndef PMPD_EXPORT_H
#define PMPD_EXPORT_H

#ifdef PMPD_STATIC_DEFINE
#  define PMPD_EXPORT
#  define PMPD_NO_EXPORT
#else
#  ifndef PMPD_EXPORT
#    ifdef PMPD_EXPORTS
        /* We are building this library */
#      define PMPD_EXPORT __attribute__((visibility("default")))
#    else
        /* We are using this library */
#      define PMPD_EXPORT __attribute__((visibility("default")))
#    endif
#  endif

#  ifndef PMPD_NO_EXPORT
#    define PMPD_NO_EXPORT __attribute__((visibility("hidden")))
#  endif
#endif

#ifndef PMPD_DEPRECATED
#  define PMPD_DEPRECATED __attribute__ ((__deprecated__))
#endif

#ifndef PMPD_DEPRECATED_EXPORT
#  define PMPD_DEPRECATED_EXPORT PMPD_EXPORT PMPD_DEPRECATED
#endif

#ifndef PMPD_DEPRECATED_NO_EXPORT
#  define PMPD_DEPRECATED_NO_EXPORT PMPD_NO_EXPORT PMPD_DEPRECATED
#endif

#if 0 /* DEFINE_NO_DEPRECATED */
#  ifndef PMPD_NO_DEPRECATED
#    define PMPD_NO_DEPRECATED
#  endif
#endif

#endif /* PMPD_EXPORT_H */
