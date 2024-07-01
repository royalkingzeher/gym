import configparser

# Read the configuration file
filename = "../setup_data.out"

config = configparser.ConfigParser()
config.read(filename)

# Check if the section exists
if "SetupData" in config:
    # Accessing values from the section
    ADMIN_TOKEN = config.get("SetupData", "ADMIN_TOKEN", fallback=None)
    GYM_ID = config.get("SetupData", "GYM_ID", fallback=None)
    GYM_MEMBER_ID = config.get("SetupData", "GYM_MEMBER_ID", fallback=None)
    GYM_ADMIN_ID = config.get("SetupData", "GYM_ADMIN_ID", fallback=None)

    # Example usage
    print(f"ADMIN_TOKEN: {ADMIN_TOKEN}")
    print(f"GYM_ID: {GYM_ID}")
    print(f"GYM_MEMBER_ID: {GYM_MEMBER_ID}")
    print(f"GYM_ADMIN_ID: {GYM_ADMIN_ID}")
else:
    print("SetupData section not found in the configuration file.")
