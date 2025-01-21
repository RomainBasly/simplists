const { PubSub } = require("@google-cloud/pubsub");

async function testPubSub() {
  try {
    const pubSubClient = new PubSub();

    // List subscriptions to test access
    const [subscriptions] = await pubSubClient.getSubscriptions();
    console.log("Subscriptions:");
    subscriptions.forEach((subscription) => console.log(subscription.name));
  } catch (error) {
    console.error("Error accessing Pub/Sub:", error);
  }
}

testPubSub();
