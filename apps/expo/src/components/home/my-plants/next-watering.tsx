import moment from "moment";
import { useState } from "react";
import { Text, View } from "react-native";

import PlantSnippetSection from "./next-watering/plant-snippet-section";
import WateringCalendar from "./next-watering/watering-calendar";

export default function NextWatering() {
  const [pickedDate, setPickedDate] = useState<string>(
    moment().format("YYYY-MM-DD"),
  );

  return (
    <View className="gap-sm px-md ">
      <Text className="heading-h1   text-surface-fg dark:text-surface">
        Arrosages à venir
      </Text>
      <WateringCalendar
        minDate={moment().format()}
        pickedDate={pickedDate}
        setPickedDate={setPickedDate}
      ></WateringCalendar>
      <PlantSnippetSection date={pickedDate}></PlantSnippetSection>
    </View>
  );
}
