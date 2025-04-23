// Best opened in Arduino IDE

const int VRX_PIN = A0;
const int VRY_PIN = A1;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  int xValue = analogRead(VRX_PIN);
  int yValue = analogRead(VRY_PIN);

  Serial.print(xValue);
  Serial.print(",");
  Serial.println(yValue);

  delay(200);
}
