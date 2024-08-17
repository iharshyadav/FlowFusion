import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
import Link from 'next/link';
  
  interface VerificationEmailProps {
    email: string;
    otp: number;
  }
  
  export default function VerificationEmail({ email, otp }: VerificationEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your verification code: {otp.toString()}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {email},</Heading>
          </Row>
          <Row>
            <Text>
              Please use the following verification
              code to complete your Verification:
            </Text>
          </Row>
          <Row>
            <Text>{otp}</Text> 
          </Row>
          <Row>
            <Text>
              If you did not request this code, please <Link href={"http://localhost:3000/"}>Report</Link> this email.
            </Text>
          </Row>
          {/* <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Verify here
            </Button>
          </Row> */}
        </Section>
      </Html>
    );
  }