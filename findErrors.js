const queryString = `
CREATE TABLE sessions (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "isRevoked" boolean NOT NULL DEFAULT False,
  "expires" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone,
  "updatedAt" timestamp with time zone,
CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id")
);
`;

let result = /(false|true)/m.exec(queryString)
if (result) {
  console.log(result);
  console.error(`\x1b[31mDBizzy Preview Syntax error: bool values must be capitalized or in upppercase (False / FALSE)\nError line: ${result[0]}\x1b[0m`)
}

result = /FOREIGN KEY \(.*\) REFERENCES .* \(.*\)/m.exec(queryString)
if (result) {
  console.error(`\x1b[31mDBizzy Preview Syntax error: space char between reference table and open bracket\nError line: ${result[0]}\x1b[0m`)
}
