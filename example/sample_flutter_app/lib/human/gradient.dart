import 'package:flutter/material.dart';


class Gradients extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: RadialGradient(colors: [
          Colors.black, Colors.grey
        ])
      ),
    );
  }
}