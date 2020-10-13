export class ReflectNode {


    /**
     * plugin data returns figma's plugin data by default
     */
    pluginData: { [key: string]: string };
}



interface ReflectReactionMixin extends ReactionMixin {
    hasInteraction(): boolean
}