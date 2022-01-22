
CREATE TABLE users (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"name" character varying(255) NOT NULL,
	"email" character varying(255) NOT NULL,
	"password" text NOT NULL,
CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE sessions (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"userId" uuid NOT NULL,
	"isRevoked" boolean NOT NULL DEFAULT FALSE,
	"expires" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"ua" character varying(255) NOT NULL,
	"ip" character varying(255) NOT NULL,
CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
);

CREATE TABLE devices (
	"hardwareCode" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"adminId" uuid NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"icon" character varying(255) NOT NULL,
	"name" character varying(255) NOT NULL,
	"alias" character varying(255) NOT NULL,
CONSTRAINT "devices_pkey" PRIMARY KEY ("hardwareCode"),
CONSTRAINT "devices_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id")
);

CREATE TABLE access_keys (
	"updatedAt" timestamp with time zone NOT NULL,
	"deviceId" uuid NOT NULL,
	"id" bigint NOT NULL DEFAULT nextval('access_keys_id_seq'::regclass),
	"expiresAt" timestamp with time zone NOT NULL,
	"maxUses" smallint NOT NULL DEFAULT 1,
	"used" smallint NOT NULL DEFAULT 0,
	"createdAt" timestamp with time zone NOT NULL,
	"value" character varying(255) NOT NULL,
CONSTRAINT "access_keys_pkey" PRIMARY KEY ("id"),
CONSTRAINT "access_keys_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("hardwareCode")
);

CREATE TABLE measurements (
	"systemType" USER-DEFINED NOT NULL,
	"deviceId" uuid NOT NULL,
	"unit" USER-DEFINED NOT NULL,
	"id" bigint NOT NULL DEFAULT nextval('measurements_id_seq'::regclass),
	"updatedAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"value" character varying(255) NOT NULL,
CONSTRAINT "measurements_pkey" PRIMARY KEY ("id"),
CONSTRAINT "measurements_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("hardwareCode")
);

CREATE TABLE tolerances (
	"id" bigint NOT NULL DEFAULT nextval('tolerances_id_seq'::regclass),
	"deviceId" uuid NOT NULL,
	"unit" USER-DEFINED NOT NULL,
	"systemType" USER-DEFINED NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"startValue" character varying(255) NOT NULL,
	"labelText" character varying(255) NOT NULL,
CONSTRAINT "tolerances_pkey" PRIMARY KEY ("id"),
CONSTRAINT "tolerances_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("hardwareCode")
);

CREATE TABLE users_to_keys_to_devices (
	"id" integer NOT NULL DEFAULT nextval('users_to_keys_to_devices_id_seq'::regclass),
	"keyId" bigint NOT NULL,
	"deviceId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
CONSTRAINT "users_to_keys_to_devices_pkey" PRIMARY KEY ("id"),
CONSTRAINT "users_to_keys_to_devices_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "access_keys"("id"),
	CONSTRAINT "users_to_keys_to_devices_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("hardwareCode"),
	CONSTRAINT "users_to_keys_to_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
);
