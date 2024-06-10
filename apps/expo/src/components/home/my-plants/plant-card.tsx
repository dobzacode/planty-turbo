import { Image, Text, useColorScheme, View } from "react-native";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment-timezone";
import { Skeleton } from "moti/skeleton";

import { api } from "~/utils/api";

export default function PlantCard({ plant }: { plant: string }) {
  const colorScheme = useColorScheme();
  const { data, isLoading, isError } = api.plant.get.useQuery(plant);

  if (isError) return null;
  if (!data) return null;

  return (
    <Skeleton show={isLoading}>
      <Link
        testID={`plant-card-${data[0]?.id}-link`}
        href={{
          pathname: "/myplants/[id]",
          params: { id: data[0]?.id },
        }}
      >
        <View className="card-neutral gap-sm  ">
          <Image
            className="rounded-t-xs "
            style={{ width: 176, height: 176 }}
            resizeMode="cover"
            source={
              //eslint-disable-next-line
              require("./../../../../assets/plant-placeholder.png")
            }
          ></Image>
          <View className="gap-sm p-sm ">
            <Text className="body-sm w-6xl text-surface-fg opacity-40 dark:text-surface dark:opacity-60">
              Prochain arrosage le {""}
              {moment(data[0]?.nextWatering)
                .tz("Europe/Paris")
                .format("DD/MM/YYYY")}
            </Text>
            <View className="w-6xl flex-row  items-center justify-between">
              <Text
                numberOfLines={1}
                className="heading-h5 w-5xl text-surface-fg dark:text-surface"
              >
                {data[0]?.name}
              </Text>
              <AntDesign
                name="right"
                size={20}
                color={colorScheme === "light" ? "black" : "white"}
              />
            </View>
          </View>
        </View>
      </Link>
    </Skeleton>
  );
}
