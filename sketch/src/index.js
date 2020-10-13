function onRun(context){
    const window = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
      NSMakeRect(0, 0, 145, 500),
      NSWindowStyleMaskClosable | NSWindowStyleMaskTitled | NSWindowStyleMaskResizable,
      NSBackingStoreBuffered,
      false
    );
  
    window.releasedWhenClosed = false;
  
    window.makeKeyAndOrderFront(nil);
  };