import { Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
import { text } from "stream/consumers";

interface CurrentUserResult {
  documents: any[];
}

interface Account {
  $id: string;
  name: string;
}

export const getCurrentUser = async (): Promise<[number, Account, string]> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("unauthorized");
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    console.log("current user", currentUser.documents.length);

    const avatar = avatars.getInitials(currentAccount.name);
    return [currentUser.documents.length, currentAccount, avatar.toString()];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTextContent = async (textContent: any): Promise<any> => {
  try {
    const user = await getCurrentUser();
    const userId = user[1].$id;
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      userId,
      textContent
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log("error in updating Editor text content");
    console.log(error);
    throw error;
  }
};

export const fetchTextContent = async (): Promise<any> => {
  try {
    const user = await getCurrentUser();
    console.log("user" + user);
    const userId = user[1].$id;
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userId,
      userId
    );
    console.log("hello" + response);
    return response;
  } catch (error) {
    console.log("error in fetching Editor text content");
    console.log(error);
    throw error;
  }
};
