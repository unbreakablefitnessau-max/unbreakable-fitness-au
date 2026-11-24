import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Types "../types/chat";

module {
  public func listMessages(messages : Map.Map<Nat, Types.Message>) : [Types.Message] {
    let all = messages.values().toArray();
    all.sort(func (a, b) = Nat.compare(a.id, b.id));
  };
};
