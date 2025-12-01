try:
    import jose
    from jose import jwt
    print(f"jose imported from: {jose.__file__}")
    # Verify it is a package (init file), not a single module file
    if not jose.__file__.endswith('__init__.py'):
        print("ERROR: jose is still a single file module!")
    else:
        print("SUCCESS: jose is a package.")
except ImportError as e:
    print(f"Import failed: {e}")
except Exception as e:
    print(f"Error: {e}")
