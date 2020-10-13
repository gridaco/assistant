import 'package:flutter/material.dart';
class Component extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Opacity(
        opacity: 0.5,
        child: Container(
          width: 247,
          height: 77,
          decoration: BoxDecoration(
            border: Border.all(
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Color(
                  0x3f000000,
                ),
                offset: Offset(
                  0,
                  4,
                ),
                blurRadius: 4,
              ),
            ],
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(
                  0xffffff,
                ),
                Color(
                  0xffffff,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}