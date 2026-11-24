import Common "common";

module {
  public type Message = {
    id : Common.MessageId;
    sender : Principal;
    senderName : Text;
    body : Text;
    createdAt : Common.Timestamp;
  };
};
