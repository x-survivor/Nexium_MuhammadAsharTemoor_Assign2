import { getText } from "@/lib/mongodb_connection";
export async function storeData(data) {
  const text = await getText("full_Text");

  const findExisting = await text.findOne({
    content: data.content,
  });
  if (!findExisting) {
    const result = await text.insertOne({
      content: data.content,
    });
    return {
      success: result.acknowledged,
      _id: result.insertedId,
    };
  }
  return findExisting;
}
