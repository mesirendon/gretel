import { Vue } from "vue-property-decorator";

declare module "vue-property-decorator" {
  interface Vue {
    $navigateTo(args);
    $firebase;
    $showModal(args, bargs);
  }
}
